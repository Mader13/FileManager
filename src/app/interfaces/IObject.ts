export interface IObject {
  checkSumAlgorithm: string[] | undefined;
  etag: string | undefined;
  key: string | undefined;
  lastModified: Date | undefined;
  owner: AWS.S3.Owner | undefined;
  size: number | undefined;
  storageClass: string | undefined;
}
