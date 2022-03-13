import { Show, ComponentProps, PropsWithChildren } from "solid-js";
import { Make_a_OutlineCircle_Around_Icon, Made_a_Solid_Circle_Around_Icon, MakeIconBtn } from "./utils";

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>;
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline";
};

type IconOptions = SvgWithIconsOptions<SvgOptions>;

export const RightArrowIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
				</Made_a_Solid_Circle_Around_Icon>
			}>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	);
};

export const RightArrowBtn = (props: ComponentProps<"button">) => {
	return (
		<MakeIconBtn
			colors={{
				fill: "#FF0060",
				stroke: "#FFF",
			}}
			icon={{
				hovered: RightArrowIcon,
				unhover: RightArrowIcon,
			}}
			width={40}
			height={40}
			{...props}
		/>
	);
};
