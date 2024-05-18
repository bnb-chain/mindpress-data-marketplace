const Route = ({ children }: any) => {
  // const location = useLocation();
  // const state = useGlobal();
  // useEffect(() => {
  //   if (['/resource', '/folder'].indexOf(location.pathname) < 0) {
  //     state.globalDispatch({
  //       type: 'RESET',
  //     });
  //   }
  // }, [location]);

  return children;
};
export default Route;
