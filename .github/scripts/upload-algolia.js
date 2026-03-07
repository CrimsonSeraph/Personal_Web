const { algoliasearch } = require('algoliasearch');
const records = require('../../public/algolia.json');

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

index
  .saveObjects(records, { autoGenerateObjectIDIfNotExist: false })
  .then(({ objectIDs }) => {
    console.log(`成功上传 ${objectIDs.length} 条记录`);
  })
  .catch(err => {
    console.error('上传失败:', err);
    process.exit(1);
  });