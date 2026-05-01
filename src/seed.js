// src/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hash = (pw) => bcrypt.hash(pw, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskos.io' },
    update: {},
    create: { name: 'Alex Morgan', email: 'admin@taskos.io', password: await hash('admin123'), role: 'ADMIN' },
  });

  const jordan = await prisma.user.upsert({
    where: { email: 'jordan@taskos.io' },
    update: {},
    create: { name: 'Jordan Lee', email: 'jordan@taskos.io', password: await hash('member123'), role: 'MEMBER' },
  });

  const sam = await prisma.user.upsert({
    where: { email: 'sam@taskos.io' },
    update: {},
    create: { name: 'Sam Rivera', email: 'sam@taskos.io', password: await hash('member123'), role: 'MEMBER' },
  });

  const casey = await prisma.user.upsert({
    where: { email: 'casey@taskos.io' },
    update: {},
    create: { name: 'Casey Park', email: 'casey@taskos.io', password: await hash('member123'), role: 'MEMBER' },
  });

  const alpha = await prisma.project.upsert({
    where: { id: 'seed-alpha' },
    update: {},
    create: {
      id: 'seed-alpha', name: 'Project Alpha', description: 'Core product launch initiative',
      color: '#1D9E75', ownerId: admin.id,
      members: { create: [{ userId: admin.id }, { userId: jordan.id }, { userId: sam.id }] },
    },
  });

  const beta = await prisma.project.upsert({
    where: { id: 'seed-beta' },
    update: {},
    create: {
      id: 'seed-beta', name: 'Design Sprint', description: 'UI/UX overhaul Q2',
      color: '#378ADD', ownerId: admin.id,
      members: { create: [{ userId: admin.id }, { userId: casey.id }] },
    },
  });

  const gamma = await prisma.project.upsert({
    where: { id: 'seed-gamma' },
    update: {},
    create: {
      id: 'seed-gamma', name: 'API v2', description: 'RESTful backend revamp',
      color: '#BA7517', ownerId: admin.id,
      members: { create: [{ userId: admin.id }, { userId: jordan.id }, { userId: sam.id }, { userId: casey.id }] },
    },
  });

  const tasksData = [
    { title: 'Design system tokens', projectId: alpha.id, assigneeId: admin.id, status: 'DONE', priority: 'HIGH', dueDate: new Date('2025-04-20') },
    { title: 'Auth API endpoints', projectId: gamma.id, assigneeId: jordan.id, status: 'IN_PROGRESS', priority: 'HIGH', dueDate: new Date('2025-05-10') },
    { title: 'User dashboard wireframes', projectId: beta.id, assigneeId: casey.id, status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: new Date('2025-05-05') },
    { title: 'DB schema migration', projectId: gamma.id, assigneeId: sam.id, status: 'TODO', priority: 'HIGH', dueDate: new Date('2025-04-28') },
    { title: 'Onboarding flow copy', projectId: beta.id, assigneeId: admin.id, status: 'TODO', priority: 'LOW', dueDate: new Date('2025-05-15') },
    { title: 'Sprint planning doc', projectId: alpha.id, assigneeId: admin.id, status: 'DONE', priority: 'MEDIUM', dueDate: new Date('2025-04-15') },
    { title: 'Role-based access control', projectId: gamma.id, assigneeId: jordan.id, status: 'IN_PROGRESS', priority: 'HIGH', dueDate: new Date('2025-04-29') },
    { title: 'Mobile breakpoints', projectId: beta.id, assigneeId: casey.id, status: 'TODO', priority: 'LOW', dueDate: new Date('2025-05-20') },
    { title: 'API rate limiting', projectId: gamma.id, assigneeId: sam.id, status: 'TODO', priority: 'HIGH', dueDate: new Date('2025-04-27') },
    { title: 'Release notes draft', projectId: alpha.id, assigneeId: jordan.id, status: 'DONE', priority: 'LOW', dueDate: new Date('2025-04-19') },
  ];

  for (const t of tasksData) {
    await prisma.task.create({ data: { ...t, creatorId: admin.id } });
  }

  console.log('✅ Seed complete!');
  console.log('Admin: admin@taskos.io / admin123');
  console.log('Member: jordan@taskos.io / member123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
