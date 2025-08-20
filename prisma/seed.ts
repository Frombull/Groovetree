// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed do banco de dados...')

  // Limpar dados existentes
  await prisma.link.deleteMany()
  await prisma.page.deleteMany()
  await prisma.user.deleteMany()

  // Usuários de teste
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'joão@exemplo.com',
        name: 'João Teste da Silva',
        page: {
          create: {
            slug: 'joao-teste-da-silva',
            title: 'João Teste da Silva - Músico',
            bio: 'Guitarrista e compositor apaixonado por rock e blues. Mais de 10 anos de experiência em shows ao vivo.',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            links: {
              create: [
                {
                  title: 'Spotify',
                  url: 'https://open.spotify.com/artist/joaotestedasilva',
                  isActive: true
                },
                {
                  title: 'Instagram',
                  url: 'https://instagram.com/joaotesteda_silva_musico',
                  isActive: true
                },
                {
                  title: 'YouTube',
                  url: 'https://youtube.com/joaotestedasilvamusica',
                  isActive: true
                },
                {
                  title: 'Site Oficial',
                  url: 'https://joaotestedasilva.com.br',
                  isActive: false
                }
              ]
            }
          }
        }
      },
      include: {
        page: {
          include: {
            links: true
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'maria@exemplo.com',
        name: 'Maria Santos',
        page: {
          create: {
            slug: 'maria-santos',
            title: 'Maria Santos - DJ',
            bio: 'DJ especializada em música eletrônica e house music. Residente de algumas das melhores casas noturnas da cidade.',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b4a4?w=400&h=400&fit=crop&crop=face',
            links: {
              create: [
                {
                  title: 'SoundCloud',
                  url: 'https://soundcloud.com/mariasantos-dj',
                  isActive: true
                },
                {
                  title: 'Instagram',
                  url: 'https://instagram.com/mariasantos_dj',
                  isActive: true
                },
                {
                  title: 'Mixcloud',
                  url: 'https://mixcloud.com/mariasantos',
                  isActive: true
                },
                {
                  title: 'Bandcamp',
                  url: 'https://mariasantos.bandcamp.com',
                  isActive: true
                },
                {
                  title: 'TikTok',
                  url: 'https://tiktok.com/@mariasantos_dj',
                  isActive: false
                }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'carlos@exemplo.com',
        name: 'Carlos Mendes',
        page: {
          create: {
            slug: 'carlos-mendes',
            title: 'Carlos Mendes - Produtor Musical',
            bio: 'Produtor musical e beatmaker especializado em hip-hop, trap e R&B. Trabalhei com diversos artistas independentes.',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            links: {
              create: [
                {
                  title: 'Spotify',
                  url: 'https://open.spotify.com/artist/carlosmendes',
                  isActive: true
                },
                {
                  title: 'Apple Music',
                  url: 'https://music.apple.com/artist/carlosmendes',
                  isActive: true
                },
                {
                  title: 'Instagram',
                  url: 'https://instagram.com/carlosmendes_producer',
                  isActive: true
                },
                {
                  title: 'LinkedIn',
                  url: 'https://linkedin.com/in/carlosmendes-producer',
                  isActive: true
                }
              ]
            }
          }
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'ana@exemplo.com',
        name: 'Ana Costa',
        page: {
          create: {
            slug: 'ana-costa',
            title: 'Ana Costa - Cantora',
            bio: 'Cantora e compositora de MPB e bossa nova. Apaixonada pela música brasileira e suas raízes culturais.',
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
            links: {
              create: [
                {
                  title: 'Spotify',
                  url: 'https://open.spotify.com/artist/anacosta',
                  isActive: true
                },
                {
                  title: 'Deezer',
                  url: 'https://deezer.com/artist/anacosta',
                  isActive: true
                },
                {
                  title: 'Instagram',
                  url: 'https://instagram.com/anacosta_cantora',
                  isActive: true
                },
                {
                  title: 'Facebook',
                  url: 'https://facebook.com/anacostamusica',
                  isActive: true
                },
                {
                  title: 'WhatsApp Business',
                  url: 'https://wa.me/5511999999999',
                  isActive: false
                }
              ]
            }
          }
        }
      }
    })
  ])

  console.log(`Users criados: ${users.length}`)

  // Usuários sem página
  const usersWithoutPage = await Promise.all([
    prisma.user.create({
      data: {
        email: 'pedro@exemplo.com',
        name: 'Pedro Lima'
      }
    }),
    prisma.user.create({
      data: {
        email: 'lucia@exemplo.com',
        name: 'Lucia Oliveira'
      }
    })
  ])

  console.log(`Users sem página: ${usersWithoutPage.length}`)
  console.log('Seed concluido!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Erro durante seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })