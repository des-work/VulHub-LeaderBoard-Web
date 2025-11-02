import { User } from '../auth/types';

export const MOCK_USERS: User[] = [
  { id: '1', email: 'neo@matrix.io', name: 'Neo', role: 'student', points: 1820, level: 4, joinDate: new Date('2024-01-15'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '2', email: 'trinity@matrix.io', name: 'Trinity', role: 'student', points: 1710, level: 4, joinDate: new Date('2024-01-18'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '3', email: 'morpheus@matrix.io', name: 'Morpheus', role: 'student', points: 1660, level: 4, joinDate: new Date('2024-01-20'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '4', email: 'oracle@matrix.io', name: 'Oracle', role: 'student', points: 1600, level: 3, joinDate: new Date('2024-01-22'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '5', email: 'acid@hackers.net', name: 'Acid Burn', role: 'student', points: 1540, level: 3, joinDate: new Date('2024-01-25'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '6', email: 'zerocool@hackers.net', name: 'Zero Cool', role: 'student', points: 1490, level: 3, joinDate: new Date('2024-01-28'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '7', email: 'crash@hackers.net', name: 'Crash Override', role: 'student', points: 1450, level: 3, joinDate: new Date('2024-02-01'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '8', email: 'architect@matrix.io', name: 'The Architect', role: 'student', points: 1425, level: 3, joinDate: new Date('2024-02-05'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '9', email: 'cypher@matrix.io', name: 'Cypher', role: 'student', points: 1370, level: 3, joinDate: new Date('2024-02-08'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '10', email: 'tank@matrix.io', name: 'Tank', role: 'student', points: 1330, level: 3, joinDate: new Date('2024-02-11'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '11', email: 'dozer@matrix.io', name: 'Dozer', role: 'student', points: 1290, level: 2, joinDate: new Date('2024-02-14'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '12', email: 'root@fsociety.tv', name: 'Root', role: 'student', points: 1260, level: 2, joinDate: new Date('2024-02-17'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '13', email: 'elliot@fsociety.tv', name: 'Elliot Alderson', role: 'student', points: 1210, level: 2, joinDate: new Date('2024-02-20'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '14', email: 'darlene@fsociety.tv', name: 'Darlene', role: 'student', points: 1185, level: 2, joinDate: new Date('2024-02-22'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
  { id: '15', email: 'lisbeth@millennium.se', name: 'Lisbeth Salander', role: 'student', points: 1150, level: 2, joinDate: new Date('2024-02-25'), lastActive: new Date(), completedActivities: [], pendingSubmissions: [], approvedSubmissions: [] },
];
