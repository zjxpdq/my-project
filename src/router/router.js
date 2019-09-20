import Main from "../layout/Main"

export default [
  {
    path: "/about",
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
    path: "/",
    name: "about",
    component: () => import("../views/About.vue")
  }
]
