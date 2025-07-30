import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}
