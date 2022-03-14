import { Show, ComponentProps, PropsWithChildren, splitProps } from "solid-js";
import { Make_a_OutlineCircle_Around_Icon, Made_a_Solid_Circle_Around_Icon, MakeIconBtn } from "./utils";

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>;
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline";
};

type IconOptions = SvgWithIconsOptions<SvgOptions>;

export const StopIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<rect stroke-linecap="round" stroke-linejoin="round" x="3" y="3" rx="3" ry="3" width="14" height="14" stroke-width={3} />
				</Made_a_Solid_Circle_Around_Icon>
			}>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<rect stroke-linecap="round" stroke-linejoin="round" x="5" y="5" rx="3" ry="3" width="14" height="14" stroke-width={3} />
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	);
};

export const StopBtn = (props: ComponentProps<"button">) => {
	return (
		<MakeIconBtn
			colors={{
				fill: "#FF0060",
				stroke: "#FFF",
			}}
			icon={{
				hovered: StopIcon,
				unhover: StopIcon,
			}}
			width={40}
			height={40}
			{...props}
		/>
	);
};
