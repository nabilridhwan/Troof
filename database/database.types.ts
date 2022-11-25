export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export interface Database {
	public: {
		Tables: {
			game: {
				Row: {
					room_id: string;
					status: string;
					game_type: number;
					room_created_at: string;
				};
				Insert: {
					room_id?: string;
					status: string;
					game_type: number;
					room_created_at?: string;
				};
				Update: {
					room_id?: string;
					status?: string;
					game_type?: number;
					room_created_at?: string;
				};
			};
			game_log: {
				Row: {
					id: number;
					log: Json;
					created_at: string | null;
					room_id: string;
				};
				Insert: {
					id?: number;
					log: Json;
					created_at?: string | null;
					room_id: string;
				};
				Update: {
					id?: number;
					log?: Json;
					created_at?: string | null;
					room_id?: string;
				};
			};
			game_type: {
				Row: {
					id: number;
					description: string;
					created_at: string | null;
					name: string;
				};
				Insert: {
					id?: number;
					description: string;
					created_at?: string | null;
					name: string;
				};
				Update: {
					id?: number;
					description?: string;
					created_at?: string | null;
					name?: string;
				};
			};
			player: {
				Row: {
					player_id: string;
					display_name: string;
					joined_at: string | null;
					game_room_id: string;
					is_party_leader: boolean;
				};
				Insert: {
					player_id?: string;
					display_name: string;
					joined_at?: string | null;
					game_room_id: string;
					is_party_leader?: boolean;
				};
				Update: {
					player_id?: string;
					display_name?: string;
					joined_at?: string | null;
					game_room_id?: string;
					is_party_leader?: boolean;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			install_available_extensions_and_test: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
