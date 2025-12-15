import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchUniversityUpdates, fetchJAMBUpdates, getAllUniversities } from '@/lib/fetchUpdates';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// This endpoint is called by Vercel Cron Jobs every hour
// It searches for new updates and stores them in Firestore
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify the request is from Vercel Cron (optional but recommended)
  // Skip auth check if CRON_SECRET is not set (for development)
  if (process.env.CRON_SECRET) {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    console.log('Starting hourly update search...');
    
    // Fetch all universities
    const universities = getAllUniversities();
    const allUpdates: any[] = [];
    
    // Fetch updates for all universities (in batches to avoid timeout)
    const batchSize = 10;
    for (let i = 0; i < Math.min(universities.length, 50); i += batchSize) {
      const batch = universities.slice(i, i + batchSize);
      
      for (const university of batch) {
        try {
          console.log(`Fetching updates for ${university.name}...`);
          const updates = await fetchUniversityUpdates(university.slug);
          
          // Check if updates already exist in Firestore
          if (db) {
            for (const update of updates) {
              try {
                const updatesRef = collection(db, 'updates');
                const q = query(updatesRef, where('id', '==', update.id));
                const querySnapshot = await getDocs(q);
                
                // Only add if it doesn't exist
                if (querySnapshot.empty) {
                  await addDoc(collection(db, 'updates'), {
                    ...update,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                  });
                  allUpdates.push(update);
                  console.log(`Added new update: ${update.title}`);
                }
              } catch (error) {
                console.error(`Error checking/adding update ${update.id}:`, error);
                // Still collect the update even if Firestore fails
                allUpdates.push(update);
              }
            }
          } else {
            // If Firestore is not available, just collect updates
            console.log(`Firestore not available. Collected ${updates.length} updates for ${university.name}`);
            allUpdates.push(...updates);
          }
        } catch (error) {
          console.error(`Error fetching updates for ${university.name}:`, error);
        }
      }
    }
    
    // Fetch JAMB updates
    try {
      const jambUpdates = fetchJAMBUpdates();
      
      if (db) {
        for (const update of jambUpdates) {
          try {
            const updatesRef = collection(db, 'updates');
            const q = query(updatesRef, where('id', '==', update.id));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
              await addDoc(collection(db, 'updates'), {
                ...update,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
              });
              allUpdates.push(update);
              console.log(`Added new JAMB update: ${update.title}`);
            }
          } catch (error) {
            console.error(`Error checking/adding JAMB update ${update.id}:`, error);
            allUpdates.push(update);
          }
        }
      } else {
        console.log(`Firestore not available. Collected ${jambUpdates.length} JAMB updates`);
        allUpdates.push(...jambUpdates);
      }
    } catch (error) {
      console.error('Error fetching JAMB updates:', error);
    }
    
    console.log(`Update search completed. Found ${allUpdates.length} new updates.`);
    
    return res.status(200).json({ 
      success: true,
      message: `Found ${allUpdates.length} new updates`,
      updatesCount: allUpdates.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return res.status(500).json({ 
      error: 'Failed to search for updates',
      message: error.message 
    });
  }
}
