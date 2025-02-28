enum AppRoutes {
  HOME = "/",
  SIGN_UP = "/sign-up",
  SIGN_IN = "/sign-in",
  LOGIN = "/login",
  ORGANIZATION_ID = "/organization/:id",
  ORGANIZATION = "/organization",
  SELECT_ORGANIZATION = "/select-org",
  BOARD_OVERVIEW = `${AppRoutes.ORGANIZATION}/:organizationId/boardOverview`,
  ACTIVITY = `${AppRoutes.ORGANIZATION}/:organizationId/activity`,
  SETTINGS = `${AppRoutes.ORGANIZATION}/:organizationId/settings`,
  BILLING = `${AppRoutes.ORGANIZATION}/:organizationId/billing`,
  BOARD_ID = `/board/:boardId`,
  EPICS = `${AppRoutes.ORGANIZATION}/:organizationId/epics`,
}

export const buildRoute = (
  route: AppRoutes | AppApiRoutes,
  params: Record<string, string | number>
) => {
  return Object.keys(params).reduce(
    (path, param) => path.replace(`:${param}`, String(params[param])),
    route
  );
};

export enum AppApiRoutes {
  BASE = "/api",
  CARDS = `${AppApiRoutes.BASE}/cards/:cardId`,
  USERS = `${AppApiRoutes.BASE}/users`,
  USERS_ORGANIZATION = `${AppApiRoutes.USERS}/organization`,
  ORGANIZATION = `${AppApiRoutes.BASE}/organization`,
}

export default AppRoutes;
