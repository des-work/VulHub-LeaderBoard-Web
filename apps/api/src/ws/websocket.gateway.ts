import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  tenantId?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class WebSocketGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      this.logger.log(`Client connected: ${client.id}`);

      // Authenticate the client
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (token) {
        try {
          const payload = this.jwtService.verify(token, {
            secret: this.configService.get<string>('app.jwt.secret'),
          });
          
          client.userId = payload.sub;
          client.tenantId = payload.tenantId;
          
          // Join tenant-specific room
          client.join(`tenant:${client.tenantId}`);
          client.join(`user:${client.userId}`);
          
          this.logger.log(`Client ${client.id} authenticated as user ${client.userId} in tenant ${client.tenantId}`);
        } catch (error) {
          this.logger.warn(`Authentication failed for client ${client.id}:`, error.message);
          client.disconnect();
          return;
        }
      } else {
        this.logger.warn(`No token provided for client ${client.id}`);
        client.disconnect();
        return;
      }
    } catch (error) {
      this.logger.error(`Error handling connection for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:tenant')
  handleJoinTenant(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { tenantId: string }) {
    if (client.tenantId === data.tenantId) {
      client.join(`tenant:${data.tenantId}`);
      this.logger.log(`Client ${client.id} joined tenant ${data.tenantId}`);
    }
  }

  @SubscribeMessage('leave:tenant')
  handleLeaveTenant(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { tenantId: string }) {
    client.leave(`tenant:${data.tenantId}`);
    this.logger.log(`Client ${client.id} left tenant ${data.tenantId}`);
  }

  @SubscribeMessage('join:project')
  handleJoinProject(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { projectId: string }) {
    client.join(`project:${data.projectId}`);
    this.logger.log(`Client ${client.id} joined project ${data.projectId}`);
  }

  @SubscribeMessage('leave:project')
  handleLeaveProject(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { projectId: string }) {
    client.leave(`project:${data.projectId}`);
    this.logger.log(`Client ${client.id} left project ${data.projectId}`);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  // Broadcast methods for real-time updates
  broadcastLeaderboardUpdate(tenantId: string, data: any) {
    this.server.to(`tenant:${tenantId}`).emit('leaderboard:update', {
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcasted leaderboard update to tenant ${tenantId}`);
  }

  broadcastSubmissionUpdate(tenantId: string, submissionId: string, data: any) {
    this.server.to(`tenant:${tenantId}`).emit('submission:update', {
      submissionId,
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcasted submission update to tenant ${tenantId}`);
  }

  broadcastBadgeEarned(userId: string, badgeData: any) {
    this.server.to(`user:${userId}`).emit('badge:earned', {
      ...badgeData,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcasted badge earned to user ${userId}`);
  }

  broadcastProjectUpdate(projectId: string, data: any) {
    this.server.to(`project:${projectId}`).emit('project:update', {
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcasted project update to project ${projectId}`);
  }

  broadcastUserActivity(tenantId: string, userId: string, activity: any) {
    this.server.to(`tenant:${tenantId}`).emit('user:activity', {
      userId,
      activity,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcasted user activity to tenant ${tenantId}`);
  }

  broadcastSystemMessage(tenantId: string, message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') {
    this.server.to(`tenant:${tenantId}`).emit('system:message', {
      message,
      type,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcasted system message to tenant ${tenantId}`);
  }

  // Get connected clients count
  getConnectedClientsCount(tenantId?: string): number {
    if (tenantId) {
      return this.server.sockets.adapter.rooms.get(`tenant:${tenantId}`)?.size || 0;
    }
    return this.server.sockets.sockets.size;
  }

  // Get connected users in a tenant
  getConnectedUsers(tenantId: string): string[] {
    const room = this.server.sockets.adapter.rooms.get(`tenant:${tenantId}`);
    if (!room) return [];

    const users: string[] = [];
    for (const socketId of room) {
      const socket = this.server.sockets.sockets.get(socketId) as AuthenticatedSocket;
      if (socket?.userId) {
        users.push(socket.userId);
      }
    }
    return [...new Set(users)]; // Remove duplicates
  }
}
