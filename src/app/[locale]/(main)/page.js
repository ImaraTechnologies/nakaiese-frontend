import Card from "@/components/Shared/Card/Card";
import Carousel from "@/components/Shared/Carousal/Carousal";
import Container from "@/components/Shared/Container/Container";
import Explorer from "@/components/Shared/Explorer/Explorer";
import { Hero } from "@/components/Shared/Hero/Hero";
import SignInBanner from "@/components/Shared/SignInBanner/SignInBanner";
import WhyChooseUs from "@/components/Shared/WhyChooseUs/WhyChooseUs";
import Testimonials from "@/components/Shared/Testimonials/Testimonials";
import { Row, Col } from "@/components/ui/Grid/Grid";
import Newsletter from "@/components/Shared/Newsletter/Newsletter";

const items = [
  { name: "New York", image: "/banner.jpg" },
  { name: "Paris", image: "/banner.jpg" },
  { name: "Tokyo", image: "/banner.jpg" },
  { name: "London", image: "/banner.jpg" },
  { name: "Sydney", image: "/banner.jpg" },
  { name: "Rome", image: "/banner.jpg" },
]
export default function Home() {
  return (
    <>
      <Hero />
      <Container>
        <WhyChooseUs />
      </Container>
      <Carousel items={items} />

      <Container>
        <SignInBanner />
      </Container>

      <Container>
        <h2 className="text-2xl font-bold mb-6">Featured Properties</h2>
        <Row gap={4} cols={1} md={3} lg={5}>
          <Col span={1}><Card title="Item 1" /></Col>
          <Col span={1}><Card title="Item 2" /></Col>
          <Col span={1}><Card title="Item 3" /></Col>
          <Col span={1}><Card title="Item 4" /></Col>
          <Col span={1}><Card title="Item 5" /></Col>
          <Col span={1}><Card title="Item 6" /></Col>

        </Row>
      </Container>

      <Container>
        <Explorer />
      </Container>

      <Container>
        <Testimonials />
      </Container>
      <Container>
        <Newsletter />
      </Container>
    </>
  );
}
