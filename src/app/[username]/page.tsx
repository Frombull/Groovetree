import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getUserPage(username: string) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        slug: username,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        links: {
          where: {
            isActive: true,
          },
        },
      },
    });
    
    return page;
  } catch (error) {
    console.error('Erro ao buscar página do usuário:', error);
    return null;
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const page = await getUserPage(username);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {page.title}
          </h1>
          {page.bio && (
            <p className="text-gray-600 mb-4">{page.bio}</p>
          )}
          <p className="text-sm text-gray-500 mb-6">@{page.slug}</p>
          
          {page.links.length > 0 && (
            <div className="space-y-3">
              {page.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}