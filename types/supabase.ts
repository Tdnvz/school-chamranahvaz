"""TypeScript definitions for Supabase database types."""
import type { Database } from './supabase'

export type Tables = Database['public']['Tables']
export type Insertables = {
  [Key in keyof Tables as `Insert${Capitalize<Key extends string ? Key : never>}`]: Tables[Key] extends { Insert: infer I } ? I : never
}
export type Updates = {
  [Key in keyof Tables as `Update${Capitalize<Key extends string ? Key : never>}`]: Tables[Key] extends { Update: infer U } ? U : never
}
export type Row = {
  [Key in keyof Tables as `${Key & string}`]: Tables[Key] extends { Row: infer R } ? R : never
}

export type Class = Row['classes']
export type Teacher = Row['teachers']
export type SchoolSettings = Row['school_settings']

export type ClassInsert = Insertables['Insertclasses']
export type TeacherInsert = Insertables['Insertteachers']
export type SchoolSettingsInsert = Insertables['InsertSchoolSettings']

export type ClassUpdate = Updates['Updateclasses']
export type TeacherUpdate = Updates['Updateteachers']
export type SchoolSettingsUpdate = Updates['UpdateSchoolSettings']