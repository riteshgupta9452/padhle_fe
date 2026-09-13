import { prisma } from '../prisma/client.js';
const include = { category: true };
export const videoRepository = {
  list: (where, skip, take) => prisma.$transaction([prisma.video.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include }), prisma.video.count({ where })]),
  findReady: (id) => prisma.video.findFirst({ where: { id, status: 'READY' }, include }),
  create: (data) => prisma.video.create({ data, include }),
  update: (id, data) => prisma.video.update({ where: { id }, data, include }),
  remove: (id) => prisma.video.delete({ where: { id } }),
  trending: () => prisma.video.findMany({ where: { status: 'READY' }, orderBy: [{ views: 'desc' }, { createdAt: 'desc' }], take: 20, include }),
  incrementViews: (id) => prisma.video.update({ where: { id }, data: { views: { increment: 1 } } })
};
