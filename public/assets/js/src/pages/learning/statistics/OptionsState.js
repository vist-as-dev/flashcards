import {State} from "../../../storage";

export class OptionsState extends State {
    constructor() {
        super(
            {
                period: "week",
                types: ['started', 'repeated', 'completed', 'wellKnown'],
            },
            'statistics.options'
        );
    }

    setPeriod(period) {
        this.setState({period});
    }

    setTypes(type, checked) {
        const {types} = this.getState();
        const _set = new Set(types);
        checked ? _set.add(type) : _set.delete(type);
        this.setState({types: [..._set]});
    }
}