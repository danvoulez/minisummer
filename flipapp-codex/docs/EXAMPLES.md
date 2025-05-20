# API Examples

```
# create a logline
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"who":"user:rafa","tenant_id":"demo","this":{"raw":"oi"}}' \
  http://localhost:5000/logs
```
