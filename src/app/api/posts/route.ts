import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { withAuth } from '@/middlewares/auth'
import { postSchema } from '@/utils/validators/postSchema'

// --- GET handler ---
const getHandler = async (req: NextRequest, decoded: { id: number }) => {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  const posts = await prisma.post.findMany({
    where: {
      authorId: decoded.id,
      title: {
        contains: search,
        mode: 'insensitive',
      },
      ...(category && {
        category: {
          is: {
            name: category,
          },
        },
      }),
    },
    include: {
      category: true,
    },
  })

  return NextResponse.json(posts)
}

// --- POST handler ---
const postHandler = async (req: NextRequest, decoded: { id: number }) => {
  try {
    const body = await req.json()
    const parsed = postSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { title, content, categoryId, tags } = parsed.data

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: categoryId ? Number(categoryId) : undefined,
        authorId: decoded.id, // Use ID from middleware
      },
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export const GET = withAuth(getHandler)
export const POST = withAuth(postHandler)
