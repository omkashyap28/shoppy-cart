import {
  Container,
  Footer,
  Categories,
  Header,
} from "@/components/layout/index";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Categories />
      <Container>
        {children}
      </Container>
      <Footer />
    </>
  );
}
