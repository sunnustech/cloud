// import { firestore } from 'firebase-admin'
import { CollectionReference, DocumentData } from '@google-cloud/firestore'

type Collection = CollectionReference<DocumentData>

/**
 * retrives a list of document ids of a collection
 * @param {Collection} collection: the collection reference
 * @return {Promise<string[]>} the list
 */
export async function listDocIdsAsync(
    collection: Collection
): Promise<string[]> {
  const list: string[] = (await collection.listDocuments()).map((e) => e.id)
  return list
}
