import { Accessor, ComponentProps,PropsWithChildren, Setter, Show, } from "solid-js";
import { Made_a_Solid_Circle_Around_Icon, Make_a_OutlineCircle_Around_Icon, MakePlayAbleIconBtn } from "./utils";

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>;
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline";
};

type PlayStateWithButton<P = {}> = P & {
	state: Accessor<boolean>;
	setState: Setter<boolean>;
};

type IconOptions = SvgWithIconsOptions<SvgOptions>;
type ButtonOptions = PlayStateWithButton<ComponentProps<"button">>;

const MicrophoneIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path
						fill-rule="evenodd"
						d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
						clip-rule="evenodd"
					/>
				</Made_a_Solid_Circle_Around_Icon>
			}>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	);
};

const PauseIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Make_a_OutlineCircle_Around_Icon {...props}>
					<path stroke-linecap="round" stroke-width={5} stroke-linejoin="round" d="M8 6 v12 M16 6 v12" />
				</Make_a_OutlineCircle_Around_Icon>
			}>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path stroke-linecap="round" stroke-width={4} stroke-linejoin="round" d="M8.5 7 v10 M15.5 7 v10" />
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	);
};

export const PlayButton = (props: ButtonOptions) => {
	return <MakePlayAbleIconBtn 
		colors={[
			{
				fill:"#FF0060",
				stroke:"#FFF"
			},{
				fill:"#FF0060",
				stroke:"#FFF"
			}
		]}
		icons={[
			{
				hovered:MicrophoneIcon,
				unhover:MicrophoneIcon,
			},
			{
				hovered:PauseIcon,
				unhover:PauseIcon
			},
		]}
		width={40}
		height={40} 
		{...props} />
};
