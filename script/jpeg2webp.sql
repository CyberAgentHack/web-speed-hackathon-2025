UPDATE episode
SET thumbnailUrl = REPLACE(thumbnailUrl, '.jpeg', '.webp')
WHERE thumbnailUrl LIKE '%.jpeg%';

UPDATE program
SET thumbnailUrl = REPLACE(thumbnailUrl, '.jpeg', '.webp')
WHERE thumbnailUrl LIKE '%.jpeg%';

UPDATE series
SET thumbnailUrl = REPLACE(thumbnailUrl, '.jpeg', '.webp')
WHERE thumbnailUrl LIKE '%.jpeg%';