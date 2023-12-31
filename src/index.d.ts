import type { Janitor } from "@rbxts/janitor";

/**
 * BindableEvent wrapper which passes variables by reference instead of by value.
 *
 * Doesn't actually use BindableEvents.
 */
declare class Signal<
	ConnectedFunctionSignature extends (...args: any) => any = () => void,
	Generic extends boolean = false,
> {
	public constructor(janitor?: Janitor);

	public static Wrap<
		ConnectedFunctionSignature extends (...args: any) => any = () => void,
		Generic extends boolean = false,
		O extends Array<unknown> = Parameters<ConnectedFunctionSignature>,
	>(
		this: void,
		rbxScriptSignal: RBXScriptSignal<
			Generic extends true
				? Parameters<ConnectedFunctionSignature> extends Array<unknown>
					? (...args: O) => void
					: ConnectedFunctionSignature
				: ConnectedFunctionSignature
		>,
		janitor?: Janitor,
	): Signal<ConnectedFunctionSignature, Generic>;

	public static Is<
		ConnectedFunctionSignature extends (...args: any) => any = () => void,
		Generic extends boolean = false,
	>(this: void, object: unknown): object is Signal<ConnectedFunctionSignature, Generic>;

	/**
	 * Fires the BindableEvent with any number of arguments
	 * @param args The arguments to pass into the connected functions
	 */
	Fire(...args: Parameters<ConnectedFunctionSignature>): void;

	/**
	 * Same as `Fire`, but uses `task.defer` internally & doesn't take advantage of thread reuse.
	 * @param args The arguments to pass into the connected functions
	 */
	FireDeferred(...args: Parameters<ConnectedFunctionSignature>): void;

	/**
	 * Connects a callback to BindableEvent.Event
	 * @param callback The function to connect to BindableEvent.Event
	 */
	Connect<O extends Array<unknown> = Parameters<ConnectedFunctionSignature>>(
		callback: Generic extends true
			? Parameters<ConnectedFunctionSignature> extends Array<unknown>
				? (...args: O) => void
				: ConnectedFunctionSignature
			: ConnectedFunctionSignature,
	): RBXScriptConnection;

	/**
	 * Connects a function to the signal, which will be called the next time the signal fires. Once the connection is triggered, it will disconnect itself.
	 * @deprecated Use `Once` instead
	 * @param callback The function to connect to BindableEvent.Event
	 */
	ConnectOnce<O extends Array<unknown> = Parameters<ConnectedFunctionSignature>>(
		callback: Generic extends true
			? Parameters<ConnectedFunctionSignature> extends Array<unknown>
				? (...args: O) => void
				: ConnectedFunctionSignature
			: ConnectedFunctionSignature,
	): RBXScriptConnection;

	/**
	 * Connects a function to the signal, which will be called the next time the signal fires. Once the connection is triggered, it will disconnect itself.
	 * @param callback The function to connect to BindableEvent.Event
	 */
	Once<O extends Array<unknown> = Parameters<ConnectedFunctionSignature>>(
		callback: Generic extends true
			? Parameters<ConnectedFunctionSignature> extends Array<unknown>
				? (...args: O) => void
				: ConnectedFunctionSignature
			: ConnectedFunctionSignature,
	): RBXScriptConnection;

	GetConnections(): Array<RBXScriptConnection>;

	/**
	 * Disconnect all handlers. Since we use a linked list it suffices to clear the
	 * reference to the head handler.
	 */
	DisconnectAll(): void;

	/**
	 * Yields the current thread until the thread is fired.
	 */
	Wait(): LuaTuple<Parameters<ConnectedFunctionSignature>>;

	/**
	 * Destroys the Signal
	 */
	Destroy(): void;
}

export = Signal;
