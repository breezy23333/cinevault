import FranchiseUniverse from "@/components/FranchiseUniverse";
import { getFranchises } from "@/lib/franchises";

export default async function FranchiseUniverseServer() {
  const franchises = await getFranchises();

  return <FranchiseUniverse franchises={franchises} />;
}