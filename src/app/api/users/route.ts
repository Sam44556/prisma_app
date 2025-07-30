import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, title, content, categoryName } = body

    // ✅ 1. Create or find user
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        password,
      },
    })

    // ✅ 2. Create or find category
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    })

    // ✅ 3. Create the post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
        categoryId: category.id,
      },
    })

    return NextResponse.json({ user, category, post })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
