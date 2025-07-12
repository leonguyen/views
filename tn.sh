tar -czf bk.tar.gz *
curl -XPOST "https://api.transfernow.net/v1/transfers" \
  -H "Content-Type: application/json" \
  -H "x-api-key: aad98a60-138a-4aec-a1d4-868fe9f2445a" \
  -d '{
        "langCode": "en",
        "toEmails": ["my.contact@provider.com", "my.other.contact@provider.com"],
        "files": [{
          "name": "bk.tar.gz",
          "size": "100M"
        }],
        "message": "A brillant transfer content, thank you",
        "subject": "BK",
        "validityStart": "2022-10-28T08:52:25.955Z",
        "validityEnd": "2022-11-01T08:52:25.955Z",
        "allowPreview": true,
        "maxDownloads": 7
      }'