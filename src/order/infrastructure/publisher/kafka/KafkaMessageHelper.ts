import { plainToInstance } from "class-transformer";


export class KafkaMessageHelper {

    getOrderEventPayload<T>(payload: string, outputType: new () => T): T {
        try {
            const json = JSON.parse(payload);
            return plainToInstance(outputType, json);
        } catch (error) {
            console.error(`Could not read ${outputType.name} object!`, error);
            throw new Error(`Could not read ${outputType.name} object!`);
        }
    }

}
