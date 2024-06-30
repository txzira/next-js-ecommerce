import CategoryNavLinks from "./CategoryNavLinks";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header>
      <Navbar>
        <CategoryNavLinks />
      </Navbar>
    </header>
  );
}
