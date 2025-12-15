export type JoinedClub = {
  _id: string;
  status: "active" | "expired";
  joinedAt: string;
  paymentId: string;
  club: {
    _id: string;
    name: string;
    category: string;
    price: number;
  };
};
