import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, IndianRupee } from "lucide-react";

interface AmountTabProps {
  productPrice: number;
  productCoins: number;
  selectedQuantity: number;
  fastModeEnabled: boolean;
}

export function AmountTab({
  productPrice,
  productCoins,
  selectedQuantity,
  fastModeEnabled,
}: AmountTabProps) {
  return (
    <Tabs className="mb-6 w-full" defaultValue="rupees">
      <TabsList className="w-full">
        <TabsTrigger value="rupees">
          <div className="flex items-center">
            <IndianRupee />
            INR
          </div>
        </TabsTrigger>
        <TabsTrigger value="coins">
          <div className="flex items-center">
            <DollarSign />
            COINS
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="rupees">
        <SummaryList
          label="Product Price"
          unit="₹"
          price={productPrice}
          quantity={selectedQuantity}
          fastModeEnabled={fastModeEnabled}
        />
      </TabsContent>
      <TabsContent value="coins">
        <SummaryList
          label="Product Coins"
          unit=""
          price={productCoins}
          quantity={selectedQuantity}
          fastModeEnabled={fastModeEnabled}
        />
      </TabsContent>
    </Tabs>
  );
}

function SummaryList({
  label,
  unit,
  price,
  quantity,
  fastModeEnabled,
}: {
  label: string;
  unit: string;
  price: number;
  quantity: number;
  fastModeEnabled: boolean;
}) {
  const total = !fastModeEnabled ? price * quantity : price * quantity + 30;

  return (
    <ul className="divide-y border-border">
      <li className="flex justify-between px-3 py-1.5 text-muted-foreground">
        <span>{label}</span>
        <span>
          {unit}
          {price.toLocaleString()}
        </span>
      </li>

      <li className="flex justify-between px-3 py-1.5 text-muted-foreground">
        <span>Quantity</span>
        <span>{quantity}</span>
      </li>

      {fastModeEnabled && (
        <li className="flex justify-between px-3 py-1.5 text-muted-foreground">
          <span>Fast Mode</span>
          <span>+30</span>
        </li>
      )}

      <li className="flex justify-between px-3 py-1 font-semibold">
        <span>Total</span>
        <span>
          <strong>
            {unit}
            {total.toLocaleString()}
          </strong>
        </span>
      </li>
    </ul>
  );
}
