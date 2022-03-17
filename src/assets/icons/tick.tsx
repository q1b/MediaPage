import { Show, ComponentProps, PropsWithChildren } from "solid-js";
import { Make_a_OutlineCircle_Around_Icon, Made_a_Solid_Circle_Around_Icon, MakeIconBtn } from "./utils";

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>;
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline";
};

type IconOptions = SvgWithIconsOptions<SvgOptions>;

export const TickIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
				</Made_a_Solid_Circle_Around_Icon>
			}>
			<Make_a_OutlineCircle_Around_Icon {...props}>
  				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	);
};

export const TickBtn = (props: ComponentProps<"button">) => {
	return (
		<MakeIconBtn
			colors={{
				fill: "#34d399",
				stroke: "#FFF",
			}}
			icon={{
				hovered: TickIcon,
				unhover: TickIcon,
			}}
			width={40}
			height={40}
			{...props}
		/>
	);
};
