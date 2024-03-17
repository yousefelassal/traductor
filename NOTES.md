## Killing idle process

### Identifying the Process

#### Mac/Linux:
```bash
sudo lsof -i :9323
```
This command will give you a list of processes using port `9323`, along with their PID (Process ID).

#### Windows:
```bash
netstat -ano | findstr :9323
```

For example:
```bash
PS C:\Users\YourUser\YourProject> netstat -ano|findstr "PID :9323"           
  Proto  Local Address          Foreign Address        State           PID
  TCP    127.0.0.1:9323         0.0.0.0:0              LISTENING       27924
```


### Killing the Process
Once you have the PID, you can kill the process:

#### Mac/Linux:

Suppose the PID you found was 27924, you'd type:
```bash
kill -9 27924
```

#### Windows:

Again, if the PID was 27924, you'd type:
```bash
taskkill /PID 27924 /F
```

## Prisma CLI

### generating types
```bash
npx prisma generate
```

### schema updates
```bash
npx prisma migrate dev --name new-model
```

## Compatibility flags
- [nodejs_compat](https://developers.cloudflare.com/workers/configuration/compatibility-dates/#nodejs-compatibility-flag) | Cloudflare docs

## Environment variables

### using `wrangler.toml`

```toml
[vars]

KEY = "..."
```

### using `.dev.vars`

similar to a regular .env
```
KEY=...
```