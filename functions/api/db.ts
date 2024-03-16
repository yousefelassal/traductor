import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const db = new PrismaClient({
    datasourceUrl: 'prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMzI1ODNkMzgtNWU0Ni00NTA5LWE2ZjktMTBmZmVhZDZkODU2IiwidGVuYW50X2lkIjoiNzZjOTMxYjExMDU3YmU0ZjE1ZGRjNTdhMjIzMDBkYmE4OWFlMTc5MGNiNzlhMmEyZTRkZGUyNDQ1NGZmMDg4ZSIsImludGVybmFsX3NlY3JldCI6ImIxOTA1Y2ExLTMyMjYtNGExYi04ZTY2LTBkMjJjODM3ZmQ2ZiJ9.ujk7MR_fnzmsZhYVpgJZQKMMru0IFJuJ1JeLJLyUloY'
}).$extends(withAccelerate())