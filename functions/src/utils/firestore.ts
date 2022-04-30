import { firestore } from 'firebase-admin'

import { CollectionReference, DocumentData } from '@google-cloud/firestore'
import { UniquenessChecker } from '../classes'

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

/**
 * retrieves a database array as a dictionary
 * mainly used to check for uniqueness
 * @param {string} collection
 * @param {string} document
 * @param {string} field
 * @return {Promise<Record<string, boolean>>}
 */
export async function getExistingDict(
  collection: string,
  document: string,
  field: string
): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {}
  const data = (
    await firestore().collection(collection).doc(document).get()
  ).data()
  if (!data) {
    return {}
  }
  const existingData: string[] = data[field]
  existingData.forEach((e) => {
    result[e] = true
  })
  return result
}

/**
 * searches all documents in {collection} and
 * retrives all values of {field}
 * @param {string} collection
 * @param {string} field
 * @return {UniquenessChecker<string>}
 */
export async function getAllExistingValues(
  collection: string,
  field: string
): Promise<UniquenessChecker<string>> {
  const result = new UniquenessChecker<string>()
  const snapshot =  await firestore().collection(collection).get()
  snapshot.forEach((doc) => {
    const value = doc.data()[field]
    result.push(value)
  })
  return result
}
