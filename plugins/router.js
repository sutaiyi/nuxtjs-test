export default ({app}) => {
  app.router.beforeEach((to,form,next) => {
    console.log('路由访问之前');
    console.log(to)
    next();
  });
}