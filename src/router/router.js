import Main from "../layout/Main"

export default [
  {
    path: "/",
    name: "home",
    component: Main,
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('./../views/Home.vue')
      }
    ]
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue")
  }
]
