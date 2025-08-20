import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';

interface UserPageProps {
  params: {
    username: string;
  };
}

async function getUser(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: username,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const user = await getUser(params.username);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">
          {user.name || 'Usuário sem nome'}
        </h1>
        <p className="text-gray-600 mt-2">ID: {user.id}</p>
      </div>
    </div>
  );
}

// Opcional: Configurar metadados dinâmicos
export async function generateMetadata({ params }: UserPageProps) {
  const user = await getUser(params.username);
  
  return {
    title: user?.name ? `${user.name} - Músico` : 'Usuário não encontrado',
    description: user?.name ? `Perfil de ${user.name}` : 'Usuário não encontrado',
  };
}