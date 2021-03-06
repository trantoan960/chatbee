/** When your routing table is too long, you can split it into small modules**/

const generalRouter = {
  path: "/",
  component: () => import("@/views/customer/layouts"),
  meta: {
    requiredAuth: true
  },
  children: [
    {
      path: "",
      name: "c_dashboard",
      component: () => import("@/views/customer/dashboard")
    },
    {
      path: "/account",
      name: "c_account",
      component: () => import("@/views/customer/account")
    },
    {
      path: "/m-account",
      name: "m_account",
      component: () => import("@/views/customer/facebookaccount")
    }
  ]
};

export default generalRouter;
