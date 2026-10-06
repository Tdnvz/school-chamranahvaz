export interface ClassRow {
  id: string
  name: string
  grade: 'elementary' | 'first' | 'second'
  gender: 'boys' | 'girls'
  subdomain: string
  capacity: number
  teacher_id: string | null
  created_at?: string
}

export interface TeacherRow {
  id: string
  name: string
  subject: string
  title: string
  bio: string
  image_url: string | null
  subdomain: string
  email: string
  phone: string
  availability: string | null
  created_at?: string
}

export interface Database {
  public: {
    Tables: {
      classes: {
        Row: ClassRow
        Insert: Omit<ClassRow, 'created_at'>
        Update: Partial<Omit<ClassRow, 'created_at'>>
      }
      teachers: {
        Row: TeacherRow
        Insert: Omit<TeacherRow, 'created_at'>
        Update: Partial<Omit<TeacherRow, 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
