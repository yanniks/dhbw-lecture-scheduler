/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.dhbw = (function() {
    
        /**
         * Namespace dhbw.
         * @exports dhbw
         * @namespace
         */
        var dhbw = {};
    
        dhbw.servercommunication = (function() {
    
            /**
             * Namespace servercommunication.
             * @memberof dhbw
             * @namespace
             */
            var servercommunication = {};
    
            servercommunication.ServerLectureResponse = (function() {
    
                /**
                 * Properties of a ServerLectureResponse.
                 * @memberof dhbw.servercommunication
                 * @interface IServerLectureResponse
                 * @property {Array.<dhbw.servercommunication.ILecture>} [lectures] ServerLectureResponse lectures
                 */
    
                /**
                 * Constructs a new ServerLectureResponse.
                 * @memberof dhbw.servercommunication
                 * @classdesc Represents a ServerLectureResponse.
                 * @constructor
                 * @param {dhbw.servercommunication.IServerLectureResponse=} [properties] Properties to set
                 */
                function ServerLectureResponse(properties) {
                    this.lectures = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ServerLectureResponse lectures.
                 * @member {Array.<dhbw.servercommunication.ILecture>}lectures
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @instance
                 */
                ServerLectureResponse.prototype.lectures = $util.emptyArray;
    
                /**
                 * Creates a new ServerLectureResponse instance using the specified properties.
                 * @function create
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @static
                 * @param {dhbw.servercommunication.IServerLectureResponse=} [properties] Properties to set
                 * @returns {dhbw.servercommunication.ServerLectureResponse} ServerLectureResponse instance
                 */
                ServerLectureResponse.create = function create(properties) {
                    return new ServerLectureResponse(properties);
                };
    
                /**
                 * Encodes the specified ServerLectureResponse message. Does not implicitly {@link dhbw.servercommunication.ServerLectureResponse.verify|verify} messages.
                 * @function encode
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @static
                 * @param {dhbw.servercommunication.IServerLectureResponse} message ServerLectureResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerLectureResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.lectures != null && message.lectures.length)
                        for (var i = 0; i < message.lectures.length; ++i)
                            $root.dhbw.servercommunication.Lecture.encode(message.lectures[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified ServerLectureResponse message, length delimited. Does not implicitly {@link dhbw.servercommunication.ServerLectureResponse.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @static
                 * @param {dhbw.servercommunication.IServerLectureResponse} message ServerLectureResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerLectureResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ServerLectureResponse message from the specified reader or buffer.
                 * @function decode
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dhbw.servercommunication.ServerLectureResponse} ServerLectureResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ServerLectureResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dhbw.servercommunication.ServerLectureResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.lectures && message.lectures.length))
                                message.lectures = [];
                            message.lectures.push($root.dhbw.servercommunication.Lecture.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ServerLectureResponse message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dhbw.servercommunication.ServerLectureResponse} ServerLectureResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ServerLectureResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ServerLectureResponse message.
                 * @function verify
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ServerLectureResponse.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.lectures != null && message.hasOwnProperty("lectures")) {
                        if (!Array.isArray(message.lectures))
                            return "lectures: array expected";
                        for (var i = 0; i < message.lectures.length; ++i) {
                            var error = $root.dhbw.servercommunication.Lecture.verify(message.lectures[i]);
                            if (error)
                                return "lectures." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a ServerLectureResponse message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dhbw.servercommunication.ServerLectureResponse} ServerLectureResponse
                 */
                ServerLectureResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.dhbw.servercommunication.ServerLectureResponse)
                        return object;
                    var message = new $root.dhbw.servercommunication.ServerLectureResponse();
                    if (object.lectures) {
                        if (!Array.isArray(object.lectures))
                            throw TypeError(".dhbw.servercommunication.ServerLectureResponse.lectures: array expected");
                        message.lectures = [];
                        for (var i = 0; i < object.lectures.length; ++i) {
                            if (typeof object.lectures[i] !== "object")
                                throw TypeError(".dhbw.servercommunication.ServerLectureResponse.lectures: object expected");
                            message.lectures[i] = $root.dhbw.servercommunication.Lecture.fromObject(object.lectures[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a ServerLectureResponse message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @static
                 * @param {dhbw.servercommunication.ServerLectureResponse} message ServerLectureResponse
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServerLectureResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.lectures = [];
                    if (message.lectures && message.lectures.length) {
                        object.lectures = [];
                        for (var j = 0; j < message.lectures.length; ++j)
                            object.lectures[j] = $root.dhbw.servercommunication.Lecture.toObject(message.lectures[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this ServerLectureResponse to JSON.
                 * @function toJSON
                 * @memberof dhbw.servercommunication.ServerLectureResponse
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ServerLectureResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ServerLectureResponse;
            })();
    
            servercommunication.Lecture = (function() {
    
                /**
                 * Properties of a Lecture.
                 * @memberof dhbw.servercommunication
                 * @interface ILecture
                 * @property {string} [begin] Lecture begin
                 * @property {string} [end] Lecture end
                 * @property {string} [title] Lecture title
                 * @property {string} [location] Lecture location
                 * @property {string} [date] Lecture date
                 * @property {string} [prof] Lecture prof
                 */
    
                /**
                 * Constructs a new Lecture.
                 * @memberof dhbw.servercommunication
                 * @classdesc Represents a Lecture.
                 * @constructor
                 * @param {dhbw.servercommunication.ILecture=} [properties] Properties to set
                 */
                function Lecture(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Lecture begin.
                 * @member {string}begin
                 * @memberof dhbw.servercommunication.Lecture
                 * @instance
                 */
                Lecture.prototype.begin = "";
    
                /**
                 * Lecture end.
                 * @member {string}end
                 * @memberof dhbw.servercommunication.Lecture
                 * @instance
                 */
                Lecture.prototype.end = "";
    
                /**
                 * Lecture title.
                 * @member {string}title
                 * @memberof dhbw.servercommunication.Lecture
                 * @instance
                 */
                Lecture.prototype.title = "";
    
                /**
                 * Lecture location.
                 * @member {string}location
                 * @memberof dhbw.servercommunication.Lecture
                 * @instance
                 */
                Lecture.prototype.location = "";
    
                /**
                 * Lecture date.
                 * @member {string}date
                 * @memberof dhbw.servercommunication.Lecture
                 * @instance
                 */
                Lecture.prototype.date = "";
    
                /**
                 * Lecture prof.
                 * @member {string}prof
                 * @memberof dhbw.servercommunication.Lecture
                 * @instance
                 */
                Lecture.prototype.prof = "";
    
                /**
                 * Creates a new Lecture instance using the specified properties.
                 * @function create
                 * @memberof dhbw.servercommunication.Lecture
                 * @static
                 * @param {dhbw.servercommunication.ILecture=} [properties] Properties to set
                 * @returns {dhbw.servercommunication.Lecture} Lecture instance
                 */
                Lecture.create = function create(properties) {
                    return new Lecture(properties);
                };
    
                /**
                 * Encodes the specified Lecture message. Does not implicitly {@link dhbw.servercommunication.Lecture.verify|verify} messages.
                 * @function encode
                 * @memberof dhbw.servercommunication.Lecture
                 * @static
                 * @param {dhbw.servercommunication.ILecture} message Lecture message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Lecture.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.begin != null && message.hasOwnProperty("begin"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.begin);
                    if (message.end != null && message.hasOwnProperty("end"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.end);
                    if (message.title != null && message.hasOwnProperty("title"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.title);
                    if (message.location != null && message.hasOwnProperty("location"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.location);
                    if (message.date != null && message.hasOwnProperty("date"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.date);
                    if (message.prof != null && message.hasOwnProperty("prof"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.prof);
                    return writer;
                };
    
                /**
                 * Encodes the specified Lecture message, length delimited. Does not implicitly {@link dhbw.servercommunication.Lecture.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dhbw.servercommunication.Lecture
                 * @static
                 * @param {dhbw.servercommunication.ILecture} message Lecture message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Lecture.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Lecture message from the specified reader or buffer.
                 * @function decode
                 * @memberof dhbw.servercommunication.Lecture
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dhbw.servercommunication.Lecture} Lecture
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Lecture.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dhbw.servercommunication.Lecture();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.begin = reader.string();
                            break;
                        case 2:
                            message.end = reader.string();
                            break;
                        case 3:
                            message.title = reader.string();
                            break;
                        case 4:
                            message.location = reader.string();
                            break;
                        case 5:
                            message.date = reader.string();
                            break;
                        case 6:
                            message.prof = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Lecture message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dhbw.servercommunication.Lecture
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dhbw.servercommunication.Lecture} Lecture
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Lecture.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Lecture message.
                 * @function verify
                 * @memberof dhbw.servercommunication.Lecture
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Lecture.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.begin != null && message.hasOwnProperty("begin"))
                        if (!$util.isString(message.begin))
                            return "begin: string expected";
                    if (message.end != null && message.hasOwnProperty("end"))
                        if (!$util.isString(message.end))
                            return "end: string expected";
                    if (message.title != null && message.hasOwnProperty("title"))
                        if (!$util.isString(message.title))
                            return "title: string expected";
                    if (message.location != null && message.hasOwnProperty("location"))
                        if (!$util.isString(message.location))
                            return "location: string expected";
                    if (message.date != null && message.hasOwnProperty("date"))
                        if (!$util.isString(message.date))
                            return "date: string expected";
                    if (message.prof != null && message.hasOwnProperty("prof"))
                        if (!$util.isString(message.prof))
                            return "prof: string expected";
                    return null;
                };
    
                /**
                 * Creates a Lecture message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dhbw.servercommunication.Lecture
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dhbw.servercommunication.Lecture} Lecture
                 */
                Lecture.fromObject = function fromObject(object) {
                    if (object instanceof $root.dhbw.servercommunication.Lecture)
                        return object;
                    var message = new $root.dhbw.servercommunication.Lecture();
                    if (object.begin != null)
                        message.begin = String(object.begin);
                    if (object.end != null)
                        message.end = String(object.end);
                    if (object.title != null)
                        message.title = String(object.title);
                    if (object.location != null)
                        message.location = String(object.location);
                    if (object.date != null)
                        message.date = String(object.date);
                    if (object.prof != null)
                        message.prof = String(object.prof);
                    return message;
                };
    
                /**
                 * Creates a plain object from a Lecture message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dhbw.servercommunication.Lecture
                 * @static
                 * @param {dhbw.servercommunication.Lecture} message Lecture
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Lecture.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.begin = "";
                        object.end = "";
                        object.title = "";
                        object.location = "";
                        object.date = "";
                        object.prof = "";
                    }
                    if (message.begin != null && message.hasOwnProperty("begin"))
                        object.begin = message.begin;
                    if (message.end != null && message.hasOwnProperty("end"))
                        object.end = message.end;
                    if (message.title != null && message.hasOwnProperty("title"))
                        object.title = message.title;
                    if (message.location != null && message.hasOwnProperty("location"))
                        object.location = message.location;
                    if (message.date != null && message.hasOwnProperty("date"))
                        object.date = message.date;
                    if (message.prof != null && message.hasOwnProperty("prof"))
                        object.prof = message.prof;
                    return object;
                };
    
                /**
                 * Converts this Lecture to JSON.
                 * @function toJSON
                 * @memberof dhbw.servercommunication.Lecture
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Lecture.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Lecture;
            })();
    
            servercommunication.ServerCourseResponse = (function() {
    
                /**
                 * Properties of a ServerCourseResponse.
                 * @memberof dhbw.servercommunication
                 * @interface IServerCourseResponse
                 * @property {Array.<dhbw.servercommunication.ICourse>} [courses] ServerCourseResponse courses
                 */
    
                /**
                 * Constructs a new ServerCourseResponse.
                 * @memberof dhbw.servercommunication
                 * @classdesc Represents a ServerCourseResponse.
                 * @constructor
                 * @param {dhbw.servercommunication.IServerCourseResponse=} [properties] Properties to set
                 */
                function ServerCourseResponse(properties) {
                    this.courses = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * ServerCourseResponse courses.
                 * @member {Array.<dhbw.servercommunication.ICourse>}courses
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @instance
                 */
                ServerCourseResponse.prototype.courses = $util.emptyArray;
    
                /**
                 * Creates a new ServerCourseResponse instance using the specified properties.
                 * @function create
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @static
                 * @param {dhbw.servercommunication.IServerCourseResponse=} [properties] Properties to set
                 * @returns {dhbw.servercommunication.ServerCourseResponse} ServerCourseResponse instance
                 */
                ServerCourseResponse.create = function create(properties) {
                    return new ServerCourseResponse(properties);
                };
    
                /**
                 * Encodes the specified ServerCourseResponse message. Does not implicitly {@link dhbw.servercommunication.ServerCourseResponse.verify|verify} messages.
                 * @function encode
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @static
                 * @param {dhbw.servercommunication.IServerCourseResponse} message ServerCourseResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerCourseResponse.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.courses != null && message.courses.length)
                        for (var i = 0; i < message.courses.length; ++i)
                            $root.dhbw.servercommunication.Course.encode(message.courses[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };
    
                /**
                 * Encodes the specified ServerCourseResponse message, length delimited. Does not implicitly {@link dhbw.servercommunication.ServerCourseResponse.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @static
                 * @param {dhbw.servercommunication.IServerCourseResponse} message ServerCourseResponse message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ServerCourseResponse.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a ServerCourseResponse message from the specified reader or buffer.
                 * @function decode
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dhbw.servercommunication.ServerCourseResponse} ServerCourseResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ServerCourseResponse.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dhbw.servercommunication.ServerCourseResponse();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.courses && message.courses.length))
                                message.courses = [];
                            message.courses.push($root.dhbw.servercommunication.Course.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a ServerCourseResponse message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dhbw.servercommunication.ServerCourseResponse} ServerCourseResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ServerCourseResponse.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a ServerCourseResponse message.
                 * @function verify
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ServerCourseResponse.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.courses != null && message.hasOwnProperty("courses")) {
                        if (!Array.isArray(message.courses))
                            return "courses: array expected";
                        for (var i = 0; i < message.courses.length; ++i) {
                            var error = $root.dhbw.servercommunication.Course.verify(message.courses[i]);
                            if (error)
                                return "courses." + error;
                        }
                    }
                    return null;
                };
    
                /**
                 * Creates a ServerCourseResponse message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dhbw.servercommunication.ServerCourseResponse} ServerCourseResponse
                 */
                ServerCourseResponse.fromObject = function fromObject(object) {
                    if (object instanceof $root.dhbw.servercommunication.ServerCourseResponse)
                        return object;
                    var message = new $root.dhbw.servercommunication.ServerCourseResponse();
                    if (object.courses) {
                        if (!Array.isArray(object.courses))
                            throw TypeError(".dhbw.servercommunication.ServerCourseResponse.courses: array expected");
                        message.courses = [];
                        for (var i = 0; i < object.courses.length; ++i) {
                            if (typeof object.courses[i] !== "object")
                                throw TypeError(".dhbw.servercommunication.ServerCourseResponse.courses: object expected");
                            message.courses[i] = $root.dhbw.servercommunication.Course.fromObject(object.courses[i]);
                        }
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a ServerCourseResponse message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @static
                 * @param {dhbw.servercommunication.ServerCourseResponse} message ServerCourseResponse
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ServerCourseResponse.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.courses = [];
                    if (message.courses && message.courses.length) {
                        object.courses = [];
                        for (var j = 0; j < message.courses.length; ++j)
                            object.courses[j] = $root.dhbw.servercommunication.Course.toObject(message.courses[j], options);
                    }
                    return object;
                };
    
                /**
                 * Converts this ServerCourseResponse to JSON.
                 * @function toJSON
                 * @memberof dhbw.servercommunication.ServerCourseResponse
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ServerCourseResponse.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return ServerCourseResponse;
            })();
    
            servercommunication.Course = (function() {
    
                /**
                 * Properties of a Course.
                 * @memberof dhbw.servercommunication
                 * @interface ICourse
                 * @property {string} [id] Course id
                 * @property {string} [title] Course title
                 */
    
                /**
                 * Constructs a new Course.
                 * @memberof dhbw.servercommunication
                 * @classdesc Represents a Course.
                 * @constructor
                 * @param {dhbw.servercommunication.ICourse=} [properties] Properties to set
                 */
                function Course(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Course id.
                 * @member {string}id
                 * @memberof dhbw.servercommunication.Course
                 * @instance
                 */
                Course.prototype.id = "";
    
                /**
                 * Course title.
                 * @member {string}title
                 * @memberof dhbw.servercommunication.Course
                 * @instance
                 */
                Course.prototype.title = "";
    
                /**
                 * Creates a new Course instance using the specified properties.
                 * @function create
                 * @memberof dhbw.servercommunication.Course
                 * @static
                 * @param {dhbw.servercommunication.ICourse=} [properties] Properties to set
                 * @returns {dhbw.servercommunication.Course} Course instance
                 */
                Course.create = function create(properties) {
                    return new Course(properties);
                };
    
                /**
                 * Encodes the specified Course message. Does not implicitly {@link dhbw.servercommunication.Course.verify|verify} messages.
                 * @function encode
                 * @memberof dhbw.servercommunication.Course
                 * @static
                 * @param {dhbw.servercommunication.ICourse} message Course message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Course.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && message.hasOwnProperty("id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                    if (message.title != null && message.hasOwnProperty("title"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                    return writer;
                };
    
                /**
                 * Encodes the specified Course message, length delimited. Does not implicitly {@link dhbw.servercommunication.Course.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dhbw.servercommunication.Course
                 * @static
                 * @param {dhbw.servercommunication.ICourse} message Course message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Course.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Course message from the specified reader or buffer.
                 * @function decode
                 * @memberof dhbw.servercommunication.Course
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dhbw.servercommunication.Course} Course
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Course.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dhbw.servercommunication.Course();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.id = reader.string();
                            break;
                        case 2:
                            message.title = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Course message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dhbw.servercommunication.Course
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dhbw.servercommunication.Course} Course
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Course.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Course message.
                 * @function verify
                 * @memberof dhbw.servercommunication.Course
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Course.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isString(message.id))
                            return "id: string expected";
                    if (message.title != null && message.hasOwnProperty("title"))
                        if (!$util.isString(message.title))
                            return "title: string expected";
                    return null;
                };
    
                /**
                 * Creates a Course message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dhbw.servercommunication.Course
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dhbw.servercommunication.Course} Course
                 */
                Course.fromObject = function fromObject(object) {
                    if (object instanceof $root.dhbw.servercommunication.Course)
                        return object;
                    var message = new $root.dhbw.servercommunication.Course();
                    if (object.id != null)
                        message.id = String(object.id);
                    if (object.title != null)
                        message.title = String(object.title);
                    return message;
                };
    
                /**
                 * Creates a plain object from a Course message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dhbw.servercommunication.Course
                 * @static
                 * @param {dhbw.servercommunication.Course} message Course
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Course.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.id = "";
                        object.title = "";
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.title != null && message.hasOwnProperty("title"))
                        object.title = message.title;
                    return object;
                };
    
                /**
                 * Converts this Course to JSON.
                 * @function toJSON
                 * @memberof dhbw.servercommunication.Course
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Course.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Course;
            })();
    
            return servercommunication;
        })();
    
        return dhbw;
    })();

    return $root;
});
