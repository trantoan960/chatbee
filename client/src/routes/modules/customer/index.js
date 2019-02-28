/** When your routing table is too long, you can split it into small modules**/

const generalRouter = {
  path: "/",
  component: require("@/views/customer/layouts").default,
  meta: {
    requiredAuth: true
  },
  children: [
    {
      path: "",
      name: "c_dashboard",
      component: require("@/views/customer/dashboard").default
    },
    {
      path: "/account",
      name: "c_account",
      component: require("@/views/customer/account").default
    },
    {
      path: "/f-message",
      name: "f_message",
      component: require("@/views/customer/messagefacebook").default
    },
    {
      path: "/f-account",
      name: "f_account",
      component: require("@/views/customer/accountfacebook").default
    },
    {
      path: "/f-timer",
      name: "f_timer",
      component: require("@/views/customer/timer").default
    },
    {
      path: "/f-script",
      name: "f_script",
      component: require("@/views/customer/scriptfacebook").default
    }
  ]
};

export default generalRouter;
