import type { Janitor } from "@rbxts/janitor";
declare const Workspace: Workspace;

/**
 * Signals allow events to be dispatched and handled. Think of it as an
 * alternative to a {@linkcode BindableEvent}.
 *
 * For example:
 *
 * ```ts
 * const signal = new Signal<(message: string) => void>();
 * signal.Connect((message) => print("Got message:", message));
 * signal.Fire("Hello world!");
 * ```
 */
declare class Signal<
	ConnectedFunctionSignature extends (...signalArguments: ReadonlyArray<never>) => void = () => void,
	Generic extends boolean = false,
> {
	/**
	 * Whether or not to do a warning when a thread is suspended when
	 * {@linkcode DisconnectAll} is called. By default it is `false`.
	 */
	public DebugMode: boolean;

	/**
	 * Constructs a new Signal.
	 * @param janitor Adds the signal to this Janitor.
	 */
	public constructor(janitor?: Janitor);

	/**
	 * Constructs a new Signal that wraps around an {@linkcode RBXScriptSignal}.
	 *
	 * @param rbxScriptSignal
	 * @param janitor
	 */
	public static Wrap<
		ConnectedFunctionSignature extends (...signalArguments: ReadonlyArray<never>) => void = () => void,
		Generic extends boolean = false,
		O extends Array<unknown> = Parameters<ConnectedFunctionSignature>,
	>(
		this: void,
		rbxScriptSignal: RBXScriptSignal<
			Generic extends true
				? Parameters<ConnectedFunctionSignature> extends Array<unknown>
					? (...signalArguments: O) => void
					: ConnectedFunctionSignature
				: ConnectedFunctionSignature
		>,
		janitor?: Janitor,
	): Signal<ConnectedFunctionSignature, Generic>;

	/**
	 * Checks if the given value is a Signal. You can use `instanceof` in TS
	 * instead.
	 *
	 * @param object
	 */
	public static Is<
		ConnectedFunctionSignature extends (...signalArguments: ReadonlyArray<never>) => void = () => void,
		Generic extends boolean = false,
	>(this: void, object: unknown): object is Signal<ConnectedFunctionSignature, Generic>;

	/**
	 * Fires the signal with any number of arguments. This is an immediate mode
	 * firing function.
	 *
	 * @param signalArguments The arguments to pass into the connected functions.
	 */
	public Fire(...signalArguments: Parameters<ConnectedFunctionSignature>): void;

	/**
	 * Same as {@linkcode Fire}, but uses `task.defer` internally & doesn't
	 * take advantage of thread reuse.
	 *
	 * @param signalArguments The arguments to pass into the connected functions.
	 */
	public FireDeferred(...signalArguments: Parameters<ConnectedFunctionSignature>): void;

	/**
	 * An "unsafe" version of {@linkcode FireDeferred} that uses recycled
	 * threads to fire. Don't know if this will work the exact same, therefore
	 * it is unsafe. This should be faster than even {@linkcode Fire} though,
	 * or around its performance level.
	 *
	 * @param signalArguments The arguments to pass into the connected functions.
	 */
	public FireDeferredUnsafe(...signalArguments: Parameters<ConnectedFunctionSignature>): void;

	/**
	 * This function mirrors how a {@linkcode BindableEvent} would be fired
	 * given the current `Workspace.SignalBehavior` setting. If it is set to
	 * `Enum.SignalBehavior.Deferred`, it will use {@linkcode FireDeferred}
	 * and if it is set to `Enum.SignalBehavior.Immediate`, it will use
	 * {@linkcode Fire}.
	 *
	 * @param signalArguments The arguments to pass into the connected functions.
	 */
	public FireBindable(...signalArguments: Parameters<ConnectedFunctionSignature>): void;

	/**
	 * This function mirrors how a {@linkcode BindableEvent} would be fired
	 * given the current `Workspace.SignalBehavior` setting. If it is set to
	 * `Enum.SignalBehavior.Deferred`, it will use
	 * {@linkcode FireDeferredUnsafe} and if it is set to
	 * `Enum.SignalBehavior.Immediate`, it will use {@linkcode Fire}.
	 *
	 * @param signalArguments The arguments to pass into the connected functions.
	 */
	public FireBindableUnsafe(...signalArguments: Parameters<ConnectedFunctionSignature>): void;

	/**
	 * Connects a function to the signal, which will be called anytime the
	 * signal is fired.
	 *
	 * @param callback The function to connect to the signal.
	 * @returns A connection object.
	 */
	public Connect<O extends Array<unknown> = Parameters<ConnectedFunctionSignature>>(
		callback: Generic extends true
			? Parameters<ConnectedFunctionSignature> extends Array<unknown>
				? (...signalArguments: O) => void
				: ConnectedFunctionSignature
			: ConnectedFunctionSignature,
	): RBXScriptConnection;

	/**
	 * Connects a function to the signal, which will be called the next time
	 * the signal fires. Once the connection is triggered, it will disconnect
	 * itself.
	 *
	 * @deprecated Use {@linkcode Once} instead
	 * @param callback The function to connect to BindableEvent.Event
	 */
	public ConnectOnce<O extends Array<unknown> = Parameters<ConnectedFunctionSignature>>(
		callback: Generic extends true
			? Parameters<ConnectedFunctionSignature> extends Array<unknown>
				? (...signalArguments: O) => void
				: ConnectedFunctionSignature
			: ConnectedFunctionSignature,
	): RBXScriptConnection;

	/**
	 * Connects a function to the signal, which will be called the next time
	 * the signal fires. Once the connection is triggered, it will disconnect
	 * itself.
	 *
	 * @param callback The function to connect to the signal.
	 */
	public Once<O extends Array<unknown> = Parameters<ConnectedFunctionSignature>>(
		callback: Generic extends true
			? Parameters<ConnectedFunctionSignature> extends Array<unknown>
				? (...signalArguments: O) => void
				: ConnectedFunctionSignature
			: ConnectedFunctionSignature,
	): RBXScriptConnection;

	/**
	 * Checks if there are any active connections in the signal.
	 * @returns Whether or not there are any active connections in the signal.
	 */
	public IsConnectedTo(): boolean;

	/**
	 * Gets all the connections in the signal.
	 * @returns The connections in the signal.
	 */
	public GetConnections(): Array<RBXScriptConnection>;

	/**
	 * Disconnect all handlers. Since we use a linked list it suffices to clear
	 * the reference to the head handler.
	 */
	public DisconnectAll(): void;

	/**
	 * Yields the current thread until the thread is fired.
	 */
	public Wait(): LuaTuple<Parameters<ConnectedFunctionSignature>>;

	/**
	 * Cleans up the signal and renders it completely unusable.
	 *
	 * ### Cleanups
	 *
	 * Technically, this is only necessary if the signal is created using
	 * {@linkcode Wrap}. Connections should be properly GC'd once the signal is
	 * no longer referenced anywhere. However, it is still good practice to
	 * include ways to strictly clean up resources. Calling {@linkcode Destroy}
	 * on a signal will also disconnect all connections immediately.
	 */
	public Destroy(): void;
}

export = Signal;
