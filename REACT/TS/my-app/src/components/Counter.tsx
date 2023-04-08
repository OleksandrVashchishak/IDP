import React, { Component } from 'react';

type counterProps = {

}

type counterState = {
    count: number
}


class Counter extends Component<counterProps, counterState> {
    constructor(props: counterProps) {
        super(props)

        this.state = {
            count: 0
        }
    }

    componentDidMount(): void {

    }

    componentWillUnmount(): void {

    }

    shouldComponentUpdate(nextProps: Readonly<counterProps>, nextState: Readonly<counterState>, nextContext: any): boolean {
        return true;
    }


    handleClick = () => {
        this.setState(({ count }) => ({
            count: ++count,
        }))
    }

    render() {
        return (
            <div>
                <h1>{this.state.count}</h1>
                <button onClick={this.handleClick}>+1</button>
            </div>
        )

    }

}

export default Counter;