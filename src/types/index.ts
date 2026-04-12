// Shared type definitions for Exhale

export type RetreatStatus = "DRAFT" | "PUBLISHED" | "SOLD_OUT" | "COMPLETED" | "CANCELED";
export type RegistrationStatus = "PENDING" | "CONFIRMED" | "WAITLISTED" | "CANCELED" | "REFUNDED";
export type PaymentStatus = "PENDING" | "PAID" | "PARTIAL" | "REFUNDED" | "FAILED";
export type PaymentMethod = "STRIPE" | "BANK_TRANSFER" | "CASH" | "OTHER";
export type PaymentType = "DEPOSIT" | "FULL";
export type RoomingPreference = "SOLO" | "WITH_FRIEND" | "NO_PREFERENCE";

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface RetreatSummary {
  id: string;
  slug: string;
  status: RetreatStatus;
  title: string;
  tagline?: string | null;
  location: string;
  startDate: Date;
  endDate: Date;
  heroImage?: string | null;
  spotsRemaining: number;
  capacity: number;
  packages: {
    id: string;
    name: string;
    fullPrice: number;
    depositAmount: number;
    available: number;
  }[];
}

export interface RegistrationFormData {
  retreatId: string;
  packageId: string;
  paymentType: PaymentType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  dietaryNeeds?: string;
  healthNotes?: string;
  roomingPref: RoomingPreference;
  additionalNotes?: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRel?: string;
}
