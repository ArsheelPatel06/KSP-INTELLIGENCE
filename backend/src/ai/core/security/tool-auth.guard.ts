import type { AiRequestContext } from '../../shared/ai-request.types';

export class ToolAuthGuard {
  // Map roles to explicitly permitted tools. If a tool isn't listed here for a role, it's denied.
  // Using '*' grants access to all tools for that role.
  private static ROLE_PERMISSIONS: Record<string, string[]> = {
    SUPERVISOR: ['*'], // Super user
    INVESTIGATOR: [
      'search_cases', 
      'get_case_details', 
      'search_ipc', 
      'check_missing_charges', 
      'get_analytics', 
      'shortest_path',
      'find_connections'
    ],
    OFFICER: [
      'search_cases', 
      'get_case_details', 
      'search_ipc'
    ]
  };

  /**
   * Evaluates whether the current user has permission to execute the specified tool.
   */
  public static isAuthorized(toolName: string, context: AiRequestContext): boolean {
    const role = (context.user.role || 'OFFICER').toUpperCase();
    const permissions = this.ROLE_PERMISSIONS[role] || [];

    if (permissions.includes('*')) {
      return true;
    }

    return permissions.includes(toolName);
  }
}
