// auth schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@email.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: 123456
 *
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: admin@email.com
 *         isActive:
 *           type: boolean
 *           example: true
 *         rol:
 *           type: string
 *           example: ADMIN
 *
 *     LoginData:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/AuthUser'
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: Invalid credentials
 *
 *     LoginResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/LoginData'
 */

// Users schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: ADMIN
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: admin@email.com
 *         isActive:
 *           type: boolean
 *           example: true
 *         roles:
 *           $ref: '#/components/schemas/Role'
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - rolId
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: user@email.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: 123456
 *         rolId:
 *           type: number
 *           example: 1
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         rolId:
 *           type: number
 *         isActive:
 *           type: boolean
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           example: 1
 *         limit:
 *           type: number
 *           example: 10
 *         total:
 *           type: number
 *           example: 25
 *
 *     UserListData:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     UserResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/User'
 *
 *     UserListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/UserListData'
 */

// Tournaments schemas
/**
 * @openapi
 * components:
 *   schemas:
 *     Tournament:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Torneo Apertura 2025
 *         startDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2025-01-10
 *         endDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2025-05-30
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           example: 2025-01-01T10:30:00-05:00
 *
 *     CreateTournamentRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           example: Torneo Apertura 2025
 *         startDate:
 *           type: string
 *           format: date
 *           example: 2025-01-10
 *         endDate:
 *           type: string
 *           format: date
 *           example: 2025-05-30
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateTournamentRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         isActive:
 *           type: boolean
 *
 *     TournamentListData:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tournament'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     TournamentResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Tournament'
 *
 *     TournamentListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/TournamentListData'
 */

// Teams schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Barcelona SC
 *         logo:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: https://cdn.app.com/logos/barcelona.png
 *         category:
 *           type: string
 *           example: Primera
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           example: 2025-01-15T09:45:00-05:00
 *
 *     CreateTeamRequest:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: Barcelona SC
 *         logo:
 *           type: string
 *           format: uri
 *           example: https://cdn.app.com/logos/barcelona.png
 *         category:
 *           type: string
 *           example: Primera
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdateTeamRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *           format: uri
 *         category:
 *           type: string
 *         isActive:
 *           type: boolean
 *
 *     TeamListData:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Team'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     TeamResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Team'
 *
 *     TeamListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/TeamListData'
 */

// Players schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     PlayerTeam:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Barcelona SC
 *
 *     Player:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 10
 *         name:
 *           type: string
 *           example: Lionel
 *         lastname:
 *           type: string
 *           example: Messi
 *         number:
 *           type: number
 *           example: 10
 *         dni:
 *           type: string
 *           example: ABC12345
 *         cardUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: https://cdn.app.com/cards/player.png
 *         team:
 *           $ref: '#/components/schemas/PlayerTeam'
 *         isActive:
 *           type: boolean
 *           example: true
 *         createAt:
 *           type: string
 *           example: 2025-01-10T14:30:00-05:00
 *
 *     CreatePlayerRequest:
 *       type: object
 *       required:
 *         - name
 *         - dni
 *         - teamId
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           example: Lionel
 *         lastname:
 *           type: string
 *           example: Messi
 *         number:
 *           type: number
 *           example: 10
 *         dni:
 *           type: string
 *           example: ABC12345
 *         teamId:
 *           type: number
 *           example: 1
 *         cardUrl:
 *           type: string
 *           format: uri
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     UpdatePlayerRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         lastname:
 *           type: string
 *         number:
 *           type: number
 *         dni:
 *           type: string
 *         teamId:
 *           type: number
 *         cardUrl:
 *           type: string
 *           format: uri
 *         isActive:
 *           type: boolean
 *
 *     PlayerListData:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Player'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *
 *     PlayerResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Player'
 *
 *     PlayerListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/PlayerListData'
 */

// Matches schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     MatchStatus:
 *       type: string
 *       enum:
 *         - programado
 *         - en_curso
 *         - finalizado
 *         - suspendido
 *         - cancelado
 *
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 12
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2025-01-20T15:00:00-05:00
 *         stage:
 *           type: string
 *           example: Fase de grupos
 *         location:
 *           type: string
 *           example: Estadio Olímpico
 *         status:
 *           $ref: '#/components/schemas/MatchStatus'
 *         localScore:
 *           type: number
 *           example: 2
 *         awayScore:
 *           type: number
 *           example: 1
 *         videoUrl:
 *           type: string
 *           example: https://youtube.com/video
 *         category:
 *           type: string
 *           example: Primera
 *         localTeam:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 1
 *             name:
 *               type: string
 *               example: Barcelona SC
 *         awayTeam:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 2
 *             name:
 *               type: string
 *               example: Emelec
 *         tournament:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 3
 *             name:
 *               type: string
 *               example: Liga Pro 2025
 *
 *     CreateMatchRequest:
 *       type: object
 *       required:
 *         - tournamentId
 *         - localTeamId
 *         - awayTeamId
 *         - stage
 *       properties:
 *         tournamentId:
 *           type: number
 *           example: 3
 *         localTeamId:
 *           type: number
 *           example: 1
 *         awayTeamId:
 *           type: number
 *           example: 2
 *         stage:
 *           type: string
 *           example: Final
 *         category:
 *           type: string
 *           example: Primera
 *         matchDay:
 *           type: number
 *           example: 5
 *         matchDate:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *           example: Estadio Olímpico
 *         status:
 *           $ref: '#/components/schemas/MatchStatus'
 *
 *     UpdateMatchRequest:
 *       type: object
 *       properties:
 *         tournamentId:
 *           type: number
 *         localTeamId:
 *           type: number
 *         awayTeamId:
 *           type: number
 *         stage:
 *           type: string
 *         category:
 *           type: string
 *         matchDay:
 *           type: number
 *         matchDate:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         status:
 *           $ref: '#/components/schemas/MatchStatus'
 *         localScore:
 *           type: number
 *         awayScore:
 *           type: number
 *
 *     MatchResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Match'
 *
 *     MatchListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Match'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

// Goals schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     Goal:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 45
 *         eventTime:
 *           type: string
 *           format: date-time
 *           example: 2025-01-20T15:32:10-05:00
 *         isOwnGoal:
 *           type: boolean
 *           example: false
 *         player:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 10
 *             name:
 *               type: string
 *               example: Luis
 *             lastName:
 *               type: string
 *               example: Díaz
 *             dni:
 *               type: string
 *               example: 0102030405
 *             number:
 *               type: number
 *               example: 9
 *         match:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 12
 *             localTeamId:
 *               type: number
 *               example: 1
 *             awayTeamId:
 *               type: number
 *               example: 2
 *             stage:
 *               type: string
 *               example: Final
 *             status:
 *               type: string
 *               example: en_curso
 *
 *     CreateGoalRequest:
 *       type: object
 *       required:
 *         - matchId
 *         - playerId
 *         - eventTime
 *       properties:
 *         matchId:
 *           type: number
 *           example: 12
 *         playerId:
 *           type: number
 *           example: 10
 *         eventTime:
 *           type: string
 *           format: date-time
 *           example: 2025-01-20T15:32:10Z
 *         isOwnGoal:
 *           type: boolean
 *           example: false
 *
 *     UpdateGoalRequest:
 *       type: object
 *       properties:
 *         matchId:
 *           type: number
 *         playerId:
 *           type: number
 *         eventTime:
 *           type: string
 *           format: date-time
 *         isOwnGoal:
 *           type: boolean
 *
 *     BulkCreateGoalRequest:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/CreateGoalRequest'
 *
 *     BulkCreateGoalResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: number
 *           example: 3
 *         message:
 *           type: string
 *           example: Se registraron 3 goles.
 *
 *     GoalResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Goal'
 *
 *     GoalListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Goal'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

// Substitutions schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     Substitution:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 8
 *         matchId:
 *           type: number
 *           example: 12
 *         eventTime:
 *           type: string
 *           format: date-time
 *           example: 2025-01-20T15:40:00-05:00
 *         playerOut:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 10
 *             name:
 *               type: string
 *               example: Juan
 *             lastName:
 *               type: string
 *               example: Pérez
 *             number:
 *               type: number
 *               example: 7
 *             dni:
 *               type: string
 *               example: 0102030405
 *         playerIn:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 18
 *             name:
 *               type: string
 *               example: Carlos
 *             lastName:
 *               type: string
 *               example: Gómez
 *             number:
 *               type: number
 *               example: 15
 *             dni:
 *               type: string
 *               example: 0918273645
 *
 *     CreateSubstitutionRequest:
 *       type: object
 *       required:
 *         - matchId
 *         - playerOut
 *         - playerIn
 *         - eventTime
 *       properties:
 *         matchId:
 *           type: number
 *           example: 12
 *         playerOut:
 *           type: number
 *           example: 10
 *         playerIn:
 *           type: number
 *           example: 18
 *         eventTime:
 *           type: string
 *           format: date-time
 *           example: 2025-01-20T15:40:00Z
 *
 *     UpdateSubstitutionRequest:
 *       type: object
 *       properties:
 *         matchId:
 *           type: number
 *         playerOut:
 *           type: number
 *         playerIn:
 *           type: number
 *         eventTime:
 *           type: string
 *           format: date-time
 *
 *     BulkCreateSubstitutionRequest:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/CreateSubstitutionRequest'
 *
 *     BulkCreateSubstitutionResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: number
 *           example: 3
 *         message:
 *           type: string
 *           example: Se insertaron 3 sustituciones de forma masiva.
 *
 *     SubstitutionResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Substitution'
 *
 *     SubstitutionListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Substitution'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

// Sanctions schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     SanctionType:
 *       type: string
 *       enum:
 *         - amarilla
 *         - roja_directa
 *         - doble_amarilla
 *       example: amarilla
 *
 *     Sanction:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 22
 *         matchId:
 *           type: number
 *           example: 12
 *         type:
 *           $ref: '#/components/schemas/SanctionType'
 *         description:
 *           type: string
 *           example: Falta reiterada
 *         eventTime:
 *           type: string
 *           format: date-time
 *           example: 2025-01-20T15:55:00-05:00
 *         player:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 10
 *             name:
 *               type: string
 *               example: Luis
 *             lastName:
 *               type: string
 *               example: Pérez
 *             number:
 *               type: number
 *               example: 9
 *             dni:
 *               type: string
 *               example: 0102030405
 *
 *     CreateSanctionRequest:
 *       type: object
 *       required:
 *         - matchId
 *         - playerId
 *         - type
 *         - eventTime
 *       properties:
 *         matchId:
 *           type: number
 *           example: 12
 *         playerId:
 *           type: number
 *           example: 10
 *         type:
 *           $ref: '#/components/schemas/SanctionType'
 *         description:
 *           type: string
 *           example: Juego peligroso
 *         eventTime:
 *           type: string
 *           format: date-time
 *           example: 2025-01-20T15:55:00Z
 *
 *     UpdateSanctionRequest:
 *       type: object
 *       properties:
 *         matchId:
 *           type: number
 *         playerId:
 *           type: number
 *         type:
 *           $ref: '#/components/schemas/SanctionType'
 *         description:
 *           type: string
 *         eventTime:
 *           type: string
 *           format: date-time
 *
 *     BulkCreateSanctionRequest:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/CreateSanctionRequest'
 *
 *     BulkCreateSanctionResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: number
 *           example: 2
 *         message:
 *           type: string
 *           example: Se insertaron 2 sanciones de forma masiva.
 *
 *     SanctionResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Sanction'
 *
 *     SanctionListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sanction'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

// Tournament-teams schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     TournamentTeam:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 15
 *         tournamentId:
 *           type: integer
 *           example: 3
 *         team:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 7
 *             name:
 *               type: string
 *               example: Barcelona SC
 *         played:
 *           type: integer
 *           example: 5
 *         won:
 *           type: integer
 *           example: 3
 *         drawn:
 *           type: integer
 *           example: 1
 *         lost:
 *           type: integer
 *           example: 1
 *         goalsFor:
 *           type: integer
 *           example: 10
 *         goalsAgainst:
 *           type: integer
 *           example: 6
 *         goalDiff:
 *           type: integer
 *           example: 4
 *         points:
 *           type: integer
 *           example: 10
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateTournamentTeamRequest:
 *       type: object
 *       required:
 *         - tournamentId
 *         - teamId
 *       properties:
 *         tournamentId:
 *           type: integer
 *           example: 3
 *         teamId:
 *           type: integer
 *           example: 7
 *
 *     UpdateTournamentTeamRequest:
 *       type: object
 *       properties:
 *         played:
 *           type: integer
 *         won:
 *           type: integer
 *         drawn:
 *           type: integer
 *         lost:
 *           type: integer
 *         goalsFor:
 *           type: integer
 *         goalsAgainst:
 *           type: integer
 *         points:
 *           type: integer
 *
 *     TournamentTeamResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/TournamentTeam'
 *
 *     TournamentTeamListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TournamentTeam'
 */

// Math-players schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     MatchPlayer:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 25
 *         isStarting:
 *           type: boolean
 *           example: true
 *         player:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 10
 *             name:
 *               type: string
 *               example: Juan Pérez
 *             number:
 *               type: number
 *               example: 9
 *         team:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 3
 *             name:
 *               type: string
 *               example: Barcelona SC
 *
 *     BulkCreateMatchPlayersRequest:
 *       type: object
 *       required:
 *         - matchId
 *         - teamId
 *         - players
 *       properties:
 *         matchId:
 *           type: number
 *           example: 12
 *         teamId:
 *           type: number
 *           example: 3
 *         players:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: object
 *             required:
 *               - playerId
 *             properties:
 *               playerId:
 *                 type: number
 *                 example: 8
 *               isStarting:
 *                 type: boolean
 *                 example: true
 *
 *     BulkCreateMatchPlayersResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 matchId:
 *                   type: number
 *                   example: 12
 *                 totalPlayers:
 *                   type: number
 *                   example: 11
 *
 *     MatchPlayerListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MatchPlayer'
 */

// Vocalia schemas

/**
 * @openapi
 * components:
 *   schemas:
 *     Vocalia:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 5
 *         matchId:
 *           type: number
 *           example: 12
 *         vocalUserId:
 *           type: number
 *           example: 20
 *         localCaptainId:
 *           type: number
 *           nullable: true
 *           example: 8
 *         awayCaptainId:
 *           type: number
 *           nullable: true
 *           example: 15
 *         observations:
 *           type: string
 *           nullable: true
 *           example: Partido sin novedades
 *         vocaliaData:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         match:
 *           type: object
 *           properties:
 *             match_id:
 *               type: number
 *               example: 12
 *             status:
 *               type: string
 *               example: programado
 *             local_score:
 *               type: number
 *               example: 0
 *             away_score:
 *               type: number
 *               example: 0
 *
 *     CreateVocaliaRequest:
 *       type: object
 *       required:
 *         - matchId
 *         - vocalUserId
 *       properties:
 *         matchId:
 *           type: number
 *           example: 12
 *         vocalUserId:
 *           type: number
 *           example: 20
 *
 *     UpdateVocaliaRequest:
 *       type: object
 *       properties:
 *         localCaptainId:
 *           type: number
 *           nullable: true
 *           example: 8
 *         awayCaptainId:
 *           type: number
 *           nullable: true
 *           example: 15
 *         observations:
 *           type: string
 *           nullable: true
 *           example: Capitán reclamó una falta
 *         vocaliaData:
 *           type: object
 *           nullable: true
 *           additionalProperties: true
 *
 *     FinalizeMatchRequest:
 *       type: object
 *       required:
 *         - localScore
 *         - awayScore
 *       properties:
 *         localScore:
 *           type: number
 *           example: 2
 *         awayScore:
 *           type: number
 *           example: 1
 *
 *     VocaliaResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Vocalia'
 *
 *     VocaliaListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vocalia'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

export {};
