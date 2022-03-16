import { Show,ComponentProps,PropsWithChildren } from "solid-js";
import { Make_a_OutlineCircle_Around_Icon, Made_a_Solid_Circle_Around_Icon, MakeIconBtn } from "./utils";

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>;
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline";
};

type IconOptions = SvgWithIconsOptions<SvgOptions>;

export const RemoveIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
				</Made_a_Solid_Circle_Around_Icon>
			}>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	);
};

export const RemoveBtn = (props: ComponentProps<'button'>) => {
	return <MakeIconBtn
		colors={{
			
				fill:"#FF0060",
				stroke:"#FFF"
		}}
		icon={{
				hovered:RemoveIcon,
				unhover:RemoveIcon,
			}}
		width={40}
		height={40} 
		{...props} />
};
