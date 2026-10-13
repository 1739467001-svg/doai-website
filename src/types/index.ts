export type Language = 'zh' | 'en';

export type UserRole = 'maker' | 'speaker' | 'judge' | 'admin' | 'visitor';

export interface User {
  id: string;
  phone: string;
  name: string;
  avatar: string;
  city: string;
  bio: string;
  skills: string[];
  role: UserRole;
  atomclubBound: boolean;
  isPublicInSquare: boolean;
  allowCardExchange: boolean;
  notifySettings: {
    system: boolean;
    review: boolean;
    team: boolean;
    forum: boolean;
    live: boolean;
  };
}

export type TicketType = 'maker' | 'guest' | 'staff' | 'forum';
export type TicketStatus = 'unclaimed' | 'claimed' | 'checked_in';

export interface DigitalTicket {
  id: string;
  title: string;
  titleEn: string;
  type: TicketType;
  holderName: string;
  holderPhone: string;
  qrCode: string;
  status: TicketStatus;
  sessionTime?: string;
  venue?: string;
  issuedAt: string;
  checkedInAt?: string;
}

export type RegistrationStatus = 'submitted' | 'reviewing' | 'needs_info' | 'shortlisted' | 'rejected';
export type TrackType = 'industry' | 'creator';

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  roleTitle: string;
  isLeader: boolean;
  avatar?: string;
}

export interface Registration {
  id: string;
  makerId: string;
  type: 'individual' | 'team';
  track: TrackType;
  teamName: string;
  projectName: string;
  projectSummary: string;
  videoUrl: string;
  docUrl: string;
  members: TeamMember[];
  inviteCode: string;
  status: RegistrationStatus;
  reviewFeedback?: string;
  needsInfoDetails?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface RecruitmentPost {
  id: string;
  track: TrackType;
  title: string;
  summary: string;
  neededRoles: string[];
  skills: string[];
  stage: 'idea' | 'prototype' | 'demo';
  city: string;
  isRemote: boolean;
  leader: {
    id: string;
    name: string;
    avatar: string;
    city: string;
  };
  likes: number;
  hasLiked?: boolean;
  applicationsCount: number;
  status: 'open' | 'filled';
  createdAt: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  city: string;
  availableTime: string;
  roleIntent: string;
  bio: string;
  likes: number;
  hasLiked?: boolean;
  atomclubVerified: boolean;
  isPublic: boolean;
}

export interface ForumSession {
  id: string;
  title: string;
  titleEn: string;
  track: string;
  trackEn: string;
  date: string;
  time: string;
  venue: string;
  venueEn: string;
  capacity: number;
  bookedCount: number;
  speakers: {
    name: string;
    nameEn: string;
    role: string;
    roleEn: string;
    org: string;
    avatar: string;
  }[];
  description: string;
  descriptionEn: string;
  isBooked?: boolean;
  status: 'upcoming' | 'ongoing' | 'finished';
}

export interface NotificationItem {
  id: string;
  type: 'system' | 'review' | 'team' | 'forum' | 'live';
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  time: string;
  read: boolean;
  link?: string;
}

export interface CMSData {
  stats: {
    makers: number;
    finalistProjects: number;
    prizePool: string;
    prizePoolEn: string;
    judges: number;
  };
  announcement: string;
  announcementEn: string;
  streamUrl: string;
}

export interface ExchangeCard {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  org: string;
  skills: string[];
  city: string;
  exchangedAt: string;
}

/* ==========================================================================
   Detail-page models
   ========================================================================== */

export interface ScheduleItem {
  id: string;
  day: 'day1' | 'day2' | 'day3';
  startTime: string;
  endTime: string;
  title: string;
  venue: string;
  type: 'keynote' | 'symposium' | 'roadshow' | 'workshop' | 'social' | 'break';
  track: TrackType | 'general';
  speaker?: string;
  capacity?: number;
  description: string;
}

export interface Venue {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  district: string;
  capacity: number;
  image: string;
  tags: string[];
  intro: string;
  facilities: string[];
  transit: string;
}

export interface ProgramBlock {
  id: string;
  eyebrow: string;
  title: string;
  titleEn: string;
  summary: string;
  bullets: { title: string; desc: string; icon: 'spark' | 'people' | 'globe' | 'trophy' | 'shield' | 'bolt' }[];
  image: string;
  stats?: { label: string; value: string }[];
}

export interface Application {
  id: string;
  recruitId: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  city: string;
  skills: string[];
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  appliedAt: string;
}

export type ProjectStage = RegistrationStatus;
