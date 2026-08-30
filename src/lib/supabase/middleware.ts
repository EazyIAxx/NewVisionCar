import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// /api/* é exclusivamente pra webhooks (Stripe, WhatsApp) — nunca rota
// autenticada por sessão de usuário (essas usam Server Actions). Sem isso,
// a chamada do Stripe (sem cookie de sessão nenhum) cai no `!user` abaixo e
// é redirecionada pro /login com 307, e o corpo do webhook nunca chega no
// handler de verdade.
const PUBLIC_PATHS = ["/login", "/signup", "/auth/confirm", "/vitrine", "/api"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  // Repassado pro layout do dashboard saber a rota atual sem uma segunda
  // consulta — usado só pra deixar /settings/billing acessível mesmo com
  // assinatura inativa (pra dar pra reassinar). Não é gate de papel/negócio
  // (isso continua responsabilidade do layout), só transporte de dado.
  supabaseResponse.headers.set("x-pathname", pathname);
  const isPublicPath =
    pathname === "/" ||
    PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && !isPublicPath && pathname !== "/onboarding") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("agency_id")
      .eq("id", user.id)
      .single();

    if (!profile?.agency_id) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
