import { Container, Footer, Header } from "@/components/layout/index";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container>
      <Header />
      {children}
      <Footer />
    </Container>
  );
}
